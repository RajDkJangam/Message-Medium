# == Schema Information
#
# Table name: users
#
#  id                 :integer          not null, primary key
#  username           :string           not null
#  email              :string           not null
#  name               :string           not null
#  bio                :text
#  photo_url          :string
#  password_digest    :string           not null
#  session_token      :string           not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  photo_file_name    :string
#  photo_content_type :string
#  photo_file_size    :integer
#  photo_updated_at   :datetime
#

class User < ApplicationRecord
  # styles: { medium: "300x300>", thumb: "100x100>" },
  has_attached_file :photo, default_url: "missing.png"
  validates_attachment_content_type :photo, content_type: /\Aimage\/.*\Z/

  validates :username, :email, :session_token, uniqueness: true
  validates :username, :email, :name, :session_token,
  :password_digest, presence: true
  validates :password, length:{minimum: 6, allow_nil: true}

  after_initialize :ensure_session_token

  attr_reader :password


  has_many :stories,
    foreign_key: :author_id,
    class_name: 'Story'

  has_many :responses,
    foreign_key: :writer_id,
    class_name: 'Response'

  # has_many :likes_on_stories,
  #   foreign_key: :story_id,
  #   class_name: 'Like'
  #
  # has_many :likes_on_responses,
  #   foreign_key: :response_id,
  #   class_name: 'Like'

  has_many :things_liked,
    foreign_key: :liker_id,
    class_name: 'Like'

  has_many :liked_stories,
    through: :things_liked,
    source: :story

  has_many :liked_responses,
    through: :things_liked,
    source: :response

  # will this work?
  # has_many :liked_stories,
  #   through: :likes_on_stories,

  # yipes

  has_many :follower_ids,
    foreign_key: :follower_id,
    class_name: 'Following'

  has_many :followers,
    through: :following_ids,
    source: :follower

  has_many :following_ids,
    foreign_key: :following_id,
    class_name: 'Following'

  has_many :following,
    through: :follower_ids,
    source: :following

# will this work?
  has_many :stories_by_followed_users,
    through: :following,
    source: :stories

  has_many :responses_by_followed_users,
    through: :following,
    source: :responses
# yipes


  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)
    return user if user && user.is_password?(password)
    nil
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def self.generate_session_token
    SecureRandom.urlsafe_base64(16)
  end

  def reset_session_token!
    self.session_token = User.generate_session_token
    self.save!
    self.session_token
  end

  private

  def ensure_session_token
    self.session_token ||= User.generate_session_token
  end

end


# username        | string    | not null, indexed, unique
# email           | string    | not null, indexed, unique
# name            | string    | not null
# bio             | text      |
# photo_url       | string    |
# password_digest | string    | not null
# session_token   | string    | not null, indexed, unique
