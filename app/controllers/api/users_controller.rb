class Api::UsersController < ApplicationController

  def create
    @user = User.new(user_params)
    if @user.save
      login(@user)
      # note: going to show page, here
      render 'api/users/show'
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def show
    @user = User.includes(stories: :author, responses: [:writer, :likes, :likers]).find(params[:id])
    render :show
  end

  def update

  end

  def destroy
    
  end

  private

  def user_params
    params.require(:user).permit(:username, :password, :email, :name, :bio, :photo)
  end

end
