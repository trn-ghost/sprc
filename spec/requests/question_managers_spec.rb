require 'rails_helper'

# RSpec.describe "QuestionManagers", type: :request do
#   describe "GET /question_managers" do
#     it "works! (now write some real specs)" do
#       get question_managers_path
#       expect(response).to have_http_status(200)
#     end
#   end
# end

RSpec.describe 'Question manager' do
  before {visit '/admin'}
  it 'should have header' do
    expect(page).to have_content 'Страница администратора'
  end

  it 'should show create theme dialog form on click' do
    find('.header .container .button').click
    #expect(page).to have_content 'Добавить тему вопросов'
    #expect(el).not_to be_nil
    s=execute_script('SPRC.showThemeWindow()')
    print s.inspect
  end

end