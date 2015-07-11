class AddCategoryToQuestions < ActiveRecord::Migration
  def change
    add_column :questions, :category, :integer, limit: 1
  end
end
