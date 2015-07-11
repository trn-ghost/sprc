class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.string :question
      t.integer :answer_type, limit: 1
      t.string :right_answer
      t.text :short_comment
      t.text :description
      t.integer :theme_id

      t.timestamps null: false
    end
  end
end
