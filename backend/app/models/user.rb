class User
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :email, type: String
  field :password_digest, type: String
  field :role, type: String
  field :name, type: String
  
  # File upload
  mount_uploader :avatar, ImageUploader
  
  # Add authentication
  has_secure_password
  
  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :role, inclusion: { in: %w[user admin] }
  
  # Relationships
  has_many :questions, dependent: :destroy
  has_many :answers, dependent: :destroy
  
  # Scopes
  scope :users, -> { where(role: 'user') }
  scope :admins, -> { where(role: 'admin') }
  
  # Methods
  def admin?
    role == 'admin'
  end
  
  def user?
    role == 'user'
  end
end
