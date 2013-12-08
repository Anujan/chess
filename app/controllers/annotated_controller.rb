class AnnotatedController < ApplicationController
  def index
    base ="./public/js/"
    @board = File.read("#{base}board.js")
    @game = File.read("#{base}game.js")
    @pieces = File.read("#{base}pieces.js")

  end
end
