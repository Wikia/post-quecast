export function dispatchAction(action, channelId) {
  channelId = channelId || 'default';
  action.timestamp = Date.now();

  var data = {
    action: action,
    channelId: channelId,
    private: true,
    libId: '@wikia/post-quecast'
  };

  top.postMessage(data, '*');
}
