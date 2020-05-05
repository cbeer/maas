class Workspace < ApplicationRecord
  def content
    self[:content].presence || { companionWindows: [], config: {}, elasticLayout: {}, viewers: {}, windows: {} }.to_json
  end
end
