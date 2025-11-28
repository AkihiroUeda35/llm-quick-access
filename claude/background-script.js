chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const suggestions = [];

  if (text.length > 0) {
    suggestions.push({
      content: text,
      description: `Ask Claude: <match>${text}</match>`,
    });
  }

  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text) => {
  await chrome.storage.local.set({ pendingPrompt: text });

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];

  if (activeTab && activeTab.id) {
    chrome.tabs.update(activeTab.id, { url: 'https://claude.ai/' });
  } else {
    chrome.tabs.create({ url: 'https://claude.ai/' });
  }
});
