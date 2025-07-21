class Answer
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :content, type: String
  
  # Relationships
  belongs_to :user
  belongs_to :question
  
  # Validations
  validates :content, presence: true
  validates :user, presence: true
  validates :question, presence: true
  
  # Callbacks
  after_create :mark_question_as_answered
  
  private
  
  def mark_question_as_answered
    question.update(status: 'answered')
  end
end
