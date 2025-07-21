import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonButtons,
  IonCheckbox
} from '@ionic/react';
import { addOutline, helpCircleOutline, personOutline, checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import './Questions.css';

const Questions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Placeholder data - will be replaced with API data
  const questions = [
    {
      id: 1,
      title: 'Bagaimana cara wudhu yang benar?',
      content: 'Saya ingin mengetahui tata cara wudhu yang sesuai dengan sunnah.',
      status: 'answered',
      isPublic: true,
      user: { name: 'Ahmad' },
      createdAt: '2024-01-15',
      answers: [
        {
          content: 'Wudhu dilakukan dengan urutan: niat, membasuh muka, membasuh kedua tangan sampai siku, mengusap kepala, dan membasuh kedua kaki sampai mata kaki.',
          user: { name: 'Ustadz Rahman', role: 'admin' },
          createdAt: '2024-01-15'
        }
      ]
    },
    {
      id: 2,
      title: 'Waktu sholat dhuha yang tepat?',
      content: 'Kapan waktu yang paling baik untuk melaksanakan sholat dhuha?',
      status: 'pending',
      isPublic: true,
      user: { name: 'Fatimah' },
      createdAt: '2024-01-16',
      answers: []
    }
  ];

  const handleSubmitQuestion = () => {
    // TODO: Implement API call to submit question
    console.log('Submitting question:', { questionTitle, questionContent, isPublic });
    setIsModalOpen(false);
    setQuestionTitle('');
    setQuestionContent('');
    setIsPublic(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tanya Jawab</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tanya Jawab</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Forum Tanya Jawab Islam</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Ajukan pertanyaan seputar Islam dan dapatkan jawaban dari para ustadz yang berpengalaman.
          </IonCardContent>
        </IonCard>

        <IonList>
          {questions.map((question) => (
            <IonItem key={question.id}>
              <IonIcon 
                icon={question.status === 'answered' ? checkmarkCircleOutline : helpCircleOutline} 
                slot="start" 
                color={question.status === 'answered' ? 'success' : 'medium'}
              />
              <IonLabel>
                <h2>{question.title}</h2>
                <p>{question.content.substring(0, 100)}...</p>
                <div className="question-meta">
                  <small>
                    <IonIcon icon={personOutline} /> {question.user.name} • 
                    <IonIcon icon={timeOutline} /> {question.createdAt} • 
                    Status: {question.status === 'answered' ? 'Terjawab' : 'Menunggu jawaban'}
                  </small>
                </div>
                {question.answers.length > 0 && (
                  <div className="answer-preview">
                    <strong>Jawaban dari {question.answers[0].user.name}:</strong>
                    <p>{question.answers[0].content.substring(0, 150)}...</p>
                  </div>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setIsModalOpen(true)}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Ajukan Pertanyaan</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsModalOpen(false)}>Tutup</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div className="question-form">
              <IonItem>
                <IonInput
                  label="Judul Pertanyaan"
                  labelPlacement="stacked"
                  placeholder="Masukkan judul pertanyaan"
                  value={questionTitle}
                  onIonInput={(e) => setQuestionTitle(e.detail.value!)}
                />
              </IonItem>
              
              <IonItem>
                <IonTextarea
                  label="Isi Pertanyaan"
                  labelPlacement="stacked"
                  placeholder="Tulis pertanyaan Anda secara detail"
                  rows={6}
                  value={questionContent}
                  onIonInput={(e) => setQuestionContent(e.detail.value!)}
                />
              </IonItem>
              
              <IonItem>
                <IonCheckbox
                  checked={isPublic}
                  onIonChange={(e) => setIsPublic(e.detail.checked)}
                />
                <IonLabel className="ion-margin-start">
                  Publikasikan pertanyaan (dapat dilihat oleh pengguna lain)
                </IonLabel>
              </IonItem>
              
              <div className="form-buttons">
                <IonButton 
                  expand="block" 
                  onClick={handleSubmitQuestion}
                  disabled={!questionTitle || !questionContent}
                >
                  Kirim Pertanyaan
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Questions;