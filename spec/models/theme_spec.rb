require 'spec_helper'

describe QuestionsTheme do
  before {@theme=QuestionsTheme.new(theme: 'Test theme 01', description: 'Description of test theme 01')}
  subject {@theme}
  it {should respond_to(:theme)}
  it {should respond_to(:description)}

  it 'should require :theme' do
    @theme.theme=' '
    expect(@theme).not_to be_valid
  end

  it 'should be uniqueness :theme ' do
    duplicate=@theme.dup
    duplicate.theme.upcase
    duplicate.save
    expect(@theme).not_to be_valid
  end
end