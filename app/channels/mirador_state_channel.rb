class MiradorStateChannel < ApplicationCable::Channel
  def subscribed
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def broadcast(action)
    Rails.logger.info(action)
    MiradorStateChannel.broadcast_to("workspace:#{action['workspaceId']}", action)
  end

  def follow(data)
    stop_all_streams
    stream_from "#{self.channel_name}:workspace:#{data['workspaceId'].to_i}"
  end

  def unfollow
    stop_all_streams
  end
end
