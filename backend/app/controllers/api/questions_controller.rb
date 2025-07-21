class Api::QuestionsController < Api::BaseController
  before_action :set_question, only: [:show, :update, :destroy]
  
  def index
    if current_user.admin?
      # Admins can see all questions
      @questions = Question.includes(:user, :answers).order(created_at: :desc)
    else
      # Users can see only their own questions and public answered questions
      @questions = Question.where(
        '$or' => [
          { user_id: current_user.id },
          { is_public: true, status: 'answered' }
        ]
      ).includes(:user, :answers).order(created_at: :desc)
    end
    
    render json: questions_response(@questions)
  end
  
  def show
    if can_view_question?(@question)
      render json: question_response(@question)
    else
      render json: { error: 'Question not found' }, status: :not_found
    end
  end
  
  def create
    @question = current_user.questions.build(question_params)
    
    if @question.save
      render json: question_response(@question), status: :created
    else
      render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def update
    if can_edit_question?(@question)
      if @question.update(question_params)
        render json: question_response(@question)
      else
        render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end
  
  def destroy
    if can_edit_question?(@question)
      @question.destroy
      render json: { message: 'Question deleted successfully' }
    else
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end
  
  private
  
  def set_question
    @question = Question.find(params[:id])
  rescue Mongoid::Errors::DocumentNotFound
    render json: { error: 'Question not found' }, status: :not_found
  end
  
  def question_params
    params.require(:question).permit(:title, :content, :is_public)
  end
  
  def can_view_question?(question)
    current_user.admin? || 
    question.user == current_user || 
    (question.is_public? && question.status == 'answered')
  end
  
  def can_edit_question?(question)
    current_user.admin? || question.user == current_user
  end
  
  def questions_response(questions)
    questions.map { |q| question_response(q) }
  end
  
  def question_response(question)
    {
      id: question.id.to_s,
      title: question.title,
      content: question.content,
      status: question.status,
      is_public: question.is_public,
      created_at: question.created_at,
      updated_at: question.updated_at,
      user: {
        id: question.user.id.to_s,
        name: question.user.name
      },
      answers: question.answers.map do |answer|
        {
          id: answer.id.to_s,
          content: answer.content,
          created_at: answer.created_at,
          user: {
            id: answer.user.id.to_s,
            name: answer.user.name,
            role: answer.user.role
          }
        }
      end
    }
  end
end
