// Flags and counters
let isMuting = true;
let mutedCount = 0;

// Create UI control
function createStopButton() {
    const button = document.createElement('button');
    button.innerText = 'Muted: 0 - Click to Stop';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 10px 20px;
        background: #1DA1F2;
        color: white;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: bold;
    `;
    button.addEventListener('click', () => {
        isMuting = false;
        button.innerText = `Stopped - Muted ${mutedCount} users`;
        button.style.background = '#657786';
    });
    document.body.appendChild(button);
    return button;
}

// Function to pause execution
function pauseScriptExecution(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Main muting function
async function mutePosts() {
    const statusButton = createStopButton();
    
    while (isMuting) {
        // Get all "More" buttons in articles
        const moreButtons = document.querySelectorAll('article button[aria-label="More"]');
        let processed = false;

        for (const button of moreButtons) {
            if (!isMuting) break;

            // Click the more button
            button.click();
            await pauseScriptExecution(300);

            // Find and click the mute option
            const menuItems = [...document.querySelectorAll("div[role='menuitem']")];
            const muteButton = menuItems.filter(item => 
                item.innerText.trim().toLowerCase().startsWith('mute ')
            )[0];

            if (muteButton) {
                muteButton.click();
                processed = true;
                mutedCount++;
                statusButton.innerText = `Muted: ${mutedCount} - Click to Stop`;
                await pauseScriptExecution(200);
            }
        }

        // After processing all current articles, load more
        if (isMuting) {
            loadMorePosts();
            await pauseScriptExecution(1000);
        }
    }
}

// Function to load more posts by scrolling
function loadMorePosts() {
    console.log("loadMorePosts")
    const articles = document.querySelectorAll('article');
    console.log("loadMorePosts, articles", articles)
    if (articles.length > 0) {
        const lastArticle = articles[articles.length - 1];
        lastArticle.scrollIntoView();
    }
}

// Start the unmuting process
mutePosts();
