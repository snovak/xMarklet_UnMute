// Flags and counters
let isUnmuting = true;
let unmutedCount = 0;

// Create UI control
function createStopButton() {
    const button = document.createElement('button');
    button.innerText = 'Unmuted: 0 - Click to Stop';
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
        isUnmuting = false;
        button.innerText = `Stopped - Unmuted ${unmutedCount} users`;
        button.style.background = '#657786';
    });
    document.body.appendChild(button);
    return button;
}

// Function to pause execution
function pauseScriptExecution(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Main unmuting function
async function mutePosts() {
    const statusButton = createStopButton();
    
    while (isUnmuting) {
        // Get all "More" buttons in articles
        const moreButtons = document.querySelectorAll('article button[aria-label="More"]');
        let processed = false;

        for (const button of moreButtons) {
            if (!isUnmuting) break;

            // Click the more button
            button.click();
            await pauseScriptExecution(300);

            // Find and click the unmute option
            const menuItems = [...document.querySelectorAll("div[role='menuitem']")];
            const unmuteButton = menuItems.filter(item => 
                item.innerText.trim().toLowerCase().startsWith('unmute')
            )[0];

            if (unmuteButton) {
                unmuteButton.click();
                processed = true;
                unmutedCount++;
                statusButton.innerText = `Unmuted: ${unmutedCount} - Click to Stop`;
                await pauseScriptExecution(200);
            }
        }

        // After processing all current articles, load more
        if (isUnmuting) {
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
