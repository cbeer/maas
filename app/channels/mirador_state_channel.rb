class MiradorStateChannel < ApplicationCable::Channel
  def subscribed
    workspace = Workspace.find(1)
    stream_for workspace
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(action)
    Rails.logger.info(action)
    MiradorStateChannel.broadcast_to(Workspace.find(1), action)
  end
end
