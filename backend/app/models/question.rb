class Question
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :title, type: String
  field :content, type: String
  field :status, type: String
  field :is_public, type: Boolean, default: true
  
  # Relationships
  belongs_to :user
  has_many :answers, dependent: :destroy
  
  # Validations
  validates :title, presence: true
  validates :content, presence: true
  validates :status, inclusion: { in: %w[pending answered] }
  
  # Scopes
  scope :public_questions, -> { where(is_public: true) }
  scope :pending, -> { where(status: 'pending') }
  scope :answered, -> { where(status: 'answered') }
  
  # Default status
  after_initialize :set_default_status
  
  private
  
  def set_default_status
    self.status ||= 'pending'
  end
end
