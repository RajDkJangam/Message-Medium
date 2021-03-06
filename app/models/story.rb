# == Schema Information
#
# Table name: stories
#
#  id                      :integer          not null, primary key
#  author_id               :integer          not null
#  title                   :string           not null
#  description             :text
#  body                    :text             not null
#  date                    :string
#  topic_id                :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  main_image_file_name    :string
#  main_image_content_type :string
#  main_image_file_size    :integer
#  main_image_updated_at   :datetime
#

class Story < ApplicationRecord

  validates :author_id, :title, :body, presence: true

  has_attached_file :main_image, default_url: "story_default.png"
  validates_attachment_content_type :main_image, content_type: /\Aimage\/.*\Z/

  belongs_to :author,
    foreign_key: :author_id,
    class_name: 'User'

  has_many :responses,
    foreign_key: :story_id,
    class_name: 'Response'

  has_many :likes,
    foreign_key: :story_id,
    class_name: 'Like'

  has_many :likers,
    through: :likes,
    source: :liker

  belongs_to :topic,
    foreign_key: :topic_id,
    class_name: 'Topic',
    optional: true

end
