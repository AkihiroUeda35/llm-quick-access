// Omniboxのキーワード("c")が入力されたときのリスナー
chrome.omnibox.onInputEntered.addListener(async (text) => {
  // 入力されたテキストを保存
  await chrome.storage.local.set({ 'pendingPrompt': text });

  // 現在アクティブなタブでclaude.aiを開くか、新しいタブで開く
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];

  if (activeTab && activeTab.id) {
    // 既存のタブを更新
    chrome.tabs.update(activeTab.id, { url: 'https://claude.ai/' });
  } else {
    // 新しいタブを作成
    chrome.tabs.create({ url: 'https://claude.ai/' });
  }
});
