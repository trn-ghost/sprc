class CreateQuestionsThemes < ActiveRecord::Migration
  def change
    create_table :questions_themes do |t|
      t.string :theme
      t.string :description
    end
  end
end
