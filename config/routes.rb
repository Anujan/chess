Chess::Application.routes.draw do
  get 'find', to: 'game#find'
  post 'move', to: 'game#move'
  post 'chat', to: 'game#chat'
  post 'quit', to: 'game#quit'
end
