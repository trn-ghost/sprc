class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
end

#Extend String class
class String
  def integer?
    true if Integer(self) rescue false
  end
end