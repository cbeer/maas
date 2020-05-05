class CreateWorkspaces < ActiveRecord::Migration[6.0]
  def change
    create_table :workspaces do |t|
      t.string :title
      t.text :content
      t.boolean :published

      t.timestamps
    end
  end
end
