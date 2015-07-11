module ApplicationHelper
  def is_integer?(num)
    true if Integer(num) rescue false
  end
end
