import consumer from "./consumer"

const MiradorStateChannel = consumer.subscriptions.create("MiradorStateChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("received:");
    console.log(data);
    if (this.callback) this.callback(data);
    // Called when there's incoming data on the websocket for this channel
  },

  follow(workspaceId, callback) {
    this.perform('follow', { workspaceId })
    this.callback = callback;
  },

  unfollow(workspaceId) {
    this.perform('unfollow', { workspaceId })
  },

  broadcast(action) {
    console.log("broadcast:");
    console.log(action);
    this.perform('broadcast', action)
  },
});

export default MiradorStateChannel;
