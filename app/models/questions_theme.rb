class QuestionsTheme < ActiveRecord::Base
  validates :theme, presence: true, uniqueness: {case_sensitive: false}
end
