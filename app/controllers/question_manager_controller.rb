class QuestionManagerController < ApplicationController
  include ApplicationHelper
  before_action :filter_param, only: :add_theme

  def index
    @themes=QuestionsTheme.all
    render layout: 'manager'
  end

  def show_theme
    @theme=QuestionsTheme.find(params[:id])
    render :inline => JSON.encode(@theme)
  end

  def add_theme
    theme=QuestionsTheme.create filter_param
    response.headers['X-created-item-id']=theme.id.to_s
    render :nothing => true
    #render :inline => '<%=debug @theme %>'
  end

  def edit_theme
    theme=QuestionsTheme.find(params[:id]).update filter_param
    render :nothing => true
  end

  def del_theme
    id=request.headers['X-item-id']
    error_handler 406 and return if !id.integer?

    QuestionsTheme.find(id).destroy
    render :nothing => true
  end

  private
  def filter_param
    params[:description].gsub! "\n", '<br />'
    return params.permit(:theme, :description)
  end

  def error_handler(code)
    response.status=code
    render :nothing => true
  end

end

=begin
Тесты для тем:
Индекс:
статус 200, наличие эдементов на странице

Добавление:
Запись добавляется если передать название / название и тему, в объекте заполнены поля
Запись не добавляется, если не передать название

Удаление:
Запись удаляется если передать цифровой id
Исключение возбуждается, если передать неверный ид
404 ошибка, если запись не найдена
Тема должна удаляться после добавления
=end