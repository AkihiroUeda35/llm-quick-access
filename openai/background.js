/*
OpenAI Quick Search Extension Background Script
MIT License

Copyright (c) 2025 Akihiro Ueda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Debug flag to control console output
const DEBUG = false;

// Debug helper function
function debugLog(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

const CHATGPT_URL = 'https://chatgpt.com/';

// Provide omnibox input suggestions
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const suggestions = [];

  if (text.length > 0) {
    suggestions.push({
      content: text,
      description: `Ask ChatGPT: <match>${text}</match>`,
    });
  }

  suggest(suggestions);
});

// Handle omnibox input
chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  const query = text.trim();

  if (query) {
    openTabWithQuery(CHATGPT_URL, query, disposition);
  } else {
    // Open ChatGPT page if no query provided
    if (disposition === 'currentTab') {
      chrome.tabs.update({ url: CHATGPT_URL });
    } else {
      chrome.tabs.create({ url: CHATGPT_URL });
    }
  }
});

// Open tab and process query for specific service
function openTabWithQuery(url, query, disposition) {
  const tabOptions = { url: url };

  if (disposition === 'currentTab') {
    chrome.tabs.update(tabOptions, (tab) => {
      // Process query after page loads
      handleQueryAfterLoad(tab.id, query);
    });
  } else {
    chrome.tabs.create(tabOptions, (tab) => {
      handleQueryAfterLoad(tab.id, query);
    });
  }
}

// Handle query after page load
function handleQueryAfterLoad(tabId, query) {
  chrome.tabs.onUpdated.addListener(function listener(
    updatedTabId,
    changeInfo,
    tab
  ) {
    if (updatedTabId === tabId && changeInfo.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener);

      setTimeout(() => {
        // Inject content script to send query
        chrome.scripting
          .executeScript({
            target: { tabId: tabId },
            func: insertQuery,
            args: [query],
          })
          .catch((error) => {
            debugLog('Script injection failed:', error);
          });
      }, 200);
    }
  });
}

// Function to insert query into page
function insertQuery(query) {
  // Debug flag and helper function for content script
  const DEBUG = false;
  function debugLog(...args) {
    if (DEBUG) {
      console.log(...args);
    }
  }

  // Retry mechanism to find elements
  let attempts = 0;
  const maxAttempts = 10;
  const retryInterval = 200;

  // ChatGPT-specific submit function
  function trySubmitQueryChatGPT(inputElement) {
    debugLog('=== CHATGPT SUBMIT START ===');

    // ChatGPT-specific selectors
    const chatgptSelectors = [
      'button[data-testid="send-button"]',
      'button[aria-label="Send prompt"]',
      'button[aria-label*="送信"]',
      'button[aria-label*="Send"]',
      'form button[type="submit"]',
      'button:has(svg[class*="icon"])',
    ];

    let submitButton = null;

    for (const selector of chatgptSelectors) {
      try {
        const buttons = document.querySelectorAll(selector);
        for (const button of buttons) {
          if (button.offsetParent !== null && !button.disabled) {
            const computedStyle = window.getComputedStyle(button);
            const isVisible =
              computedStyle.display !== 'none' &&
              computedStyle.visibility !== 'hidden' &&
              computedStyle.opacity !== '0';

            if (isVisible) {
              submitButton = button;
              debugLog('✓ ChatGPT submit button found:', selector);
              break;
            }
          }
        }
        if (submitButton) break;
      } catch (error) {
        debugLog(`Error with selector ${selector}:`, error);
      }
    }

    if (submitButton) {
      try {
        submitButton.focus();
        submitButton.click();
        debugLog('✓ ChatGPT submit successful');
        return true;
      } catch (error) {
        debugLog('✗ ChatGPT submit failed:', error);
      }
    }

    // Fallback: Enter key
    try {
      inputElement.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          bubbles: true,
          cancelable: true,
        })
      );
      debugLog('✓ ChatGPT Enter key sent');
    } catch (error) {
      debugLog('✗ ChatGPT Enter key failed:', error);
    }

    return false;
  }

  function tryInsertQuery() {
    attempts++;

    // ChatGPT-specific selectors
    const selectors = [
      '#prompt-textarea',
      'textarea[data-id="root"]',
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="メッセージ"]',
      'div[contenteditable="true"][data-placeholder]',
      'div[contenteditable="true"]',
    ];

    let inputFound = false;
    let inputElement = null;

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);

      for (const element of elements) {
        if (element.offsetParent === null || element.disabled) {
          continue;
        }

        try {
          // Handle textarea
          if (element.tagName === 'TEXTAREA') {
            element.value = query;
            element.focus();

            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));

            inputFound = true;
            inputElement = element;
            debugLog('✓ ChatGPT query inserted (textarea):', query);
            break;
          }
          // Handle contenteditable div
          else if (element.contentEditable === 'true') {
            element.textContent = query;
            element.focus();

            // Move cursor to end
            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));

            inputFound = true;
            inputElement = element;
            debugLog('✓ ChatGPT query inserted (contenteditable):', query);
            break;
          }
        } catch (error) {
          debugLog('Error inserting query:', error);
          continue;
        }
      }

      if (inputFound) break;
    }

    if (inputFound && inputElement) {
      // Adjust wait time for ChatGPT
      setTimeout(() => {
        trySubmitQueryChatGPT(inputElement);
      }, 100);
    } else if (!inputFound && attempts < maxAttempts) {
      debugLog(
        `ChatGPT attempt ${attempts}: Input field not found, retrying...`
      );
      setTimeout(tryInsertQuery, retryInterval);
    } else if (!inputFound) {
      debugLog('ChatGPT input field not found after all attempts');
    }
  }

  // Initial execution
  setTimeout(tryInsertQuery, 100);
}

// Set default omnibox suggestion
chrome.omnibox.setDefaultSuggestion({
  description: 'ChatGPT Quick Search - Enter your query',
});
