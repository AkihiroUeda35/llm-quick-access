// ページ読み込み時にプロンプトがあるかチェック
(async function() {
  const result = await chrome.storage.local.get(['pendingPrompt']);
  
  if (!result.pendingPrompt) {
    return;
  }
  
  const prompt = result.pendingPrompt;
  
  // プロンプトを削除(一度だけ使用)
  chrome.storage.local.remove(['pendingPrompt']);
  
  // テキストエリアを見つけるまで待機
  const maxAttempts = 50;
  let attempts = 0;
  
  const interval = setInterval(() => {
    attempts++;
    
    // claude.aiのテキストエリアを探す
    // 複数のセレクタで試行
    const selectors = [
      'div[contenteditable="true"]',
      'textarea',
      '[role="textbox"]',
      'div.ProseMirror'
    ];
    
    let textArea = null;
    for (const selector of selectors) {
      textArea = document.querySelector(selector);
      if (textArea) break;
    }
    
    if (textArea) {
      clearInterval(interval);
      
      // テキストを入力
      if (textArea.tagName === 'TEXTAREA') {
        textArea.value = prompt;
        textArea.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        // contenteditableの場合
        textArea.textContent = prompt;
        textArea.dispatchEvent(new Event('input', { bubbles: true }));
        
        // フォーカスを当てる
        textArea.focus();
      }
      
      // 送信ボタンを探して自動的に押す(オプション)
      setTimeout(() => {
        const submitSelectors = [
          'button[type="submit"]',
          'button[aria-label*="送信"]',
          'button[aria-label*="Send"]',
          'button:has(svg)'
        ];
        
        for (const selector of submitSelectors) {
          const submitButton = document.querySelector(selector);
          if (submitButton && !submitButton.disabled) {
            // 自動送信はコメントアウト(手動で送信したい場合)
            submitButton.click();
            break;
          }
        }
      }, 500);
      
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.log('Claude Omnibox: テキストエリアが見つかりませんでした');
    }
  }, 200);
})();