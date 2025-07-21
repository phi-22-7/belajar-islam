class Api::AnswersController < Api::BaseController
  before_action :admin_required, only: [:create]
  before_action :set_question
  before_action :set_answer, only: [:update, :destroy]
  
  def index
    @answers = @question.answers.includes(:user).order(created_at: :asc)
    render json: answers_response(@answers)
  end
  
  def create
    @answer = @question.answers.build(answer_params)
    @answer.user = current_user
    
    if @answer.save
      render json: answer_response(@answer), status: :created
    else
      render json: { errors: @answer.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def update
    if can_edit_answer?(@answer)
      if @answer.update(answer_params)
        render json: answer_response(@answer)
      else
        render json: { errors: @answer.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end
  
  def destroy
    if can_edit_answer?(@answer)
      @answer.destroy
      render json: { message: 'Answer deleted successfully' }
    else
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end
  
  private
  
  def set_question
    @question = Question.find(params[:question_id])
  rescue Mongoid::Errors::DocumentNotFound
    render json: { error: 'Question not found' }, status: :not_found
  end
  
  def set_answer
    @answer = @question.answers.find(params[:id])
  rescue Mongoid::Errors::DocumentNotFound
    render json: { error: 'Answer not found' }, status: :not_found
  end
  
  def answer_params
    params.require(:answer).permit(:content)
  end
  
  def can_edit_answer?(answer)
    current_user.admin? && answer.user == current_user
  end
  
  def answers_response(answers)
    answers.map { |a| answer_response(a) }
  end
  
  def answer_response(answer)
    {
      id: answer.id.to_s,
      content: answer.content,
      created_at: answer.created_at,
      updated_at: answer.updated_at,
      user: {
        id: answer.user.id.to_s,
        name: answer.user.name,
        role: answer.user.role
      },
      question_id: answer.question.id.to_s
    }
  end
end
