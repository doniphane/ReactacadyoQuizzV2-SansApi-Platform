

import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

// Import des types
import type { Student, AnswerDetail } from '../types';

// Interface pour les données de quiz
interface QuizData {
    title: string;
    code: string;
}

// Interface pour les données d'export global
interface GlobalExportData {
    students: Student[];
    quizData: QuizData;
}

// Interface pour les données d'export individuel
interface IndividualExportData {
    student: Student;
    answers: AnswerDetail[];
    quizData: QuizData;
}


export const exportAllResultsPDF = (data: GlobalExportData): void => {
    const { students, quizData } = data;

    if (students.length === 0) {
        toast.error('Aucune donnée à exporter');
        return;
    }

    try {
        const doc = new jsPDF();

        
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Rapport des Résultats du Quiz', 105, 20, { align: 'center' });

        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Quiz: ${quizData.title}`, 20, 35);
        doc.text(`Code: ${quizData.code}`, 20, 45);
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 55);

        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Nom', 20, 80);
        doc.text('Date', 80, 80);
        doc.text('Score', 130, 80);
        doc.text('Pourcentage', 170, 80);

        
        doc.setFont('helvetica', 'normal');
        let y = 90;

        students.forEach((student: Student) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.text(student.name, 20, y);
            doc.text(student.date, 80, y);
            doc.text(`${student.score}/${student.totalQuestions}`, 130, y);
            doc.text(`${student.percentage}%`, 170, y);
            y += 10;
        });

       
        const filename = `resultats_${quizData.code}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        toast.success('Export PDF réussi !');

    } catch {
        toast.error('Erreur lors de l\'export PDF');
    }
};


export const exportStudentResultPDF = (data: IndividualExportData): void => {
    const { student, answers, quizData } = data;

    if (!student || !answers.length) {
        toast.error('Sélectionnez un étudiant d\'abord');
        return;
    }

    try {
        const doc = new jsPDF();

        // Titre
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Rapport Individuel', 105, 20, { align: 'center' });

        // Infos
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Étudiant: ${student.name}`, 20, 40);
        doc.text(`Quiz: ${quizData.title}`, 20, 50);
        doc.text(`Date: ${student.date}`, 20, 60);
        doc.text(`Score: ${student.score}/${student.totalQuestions} (${student.percentage}%)`, 20, 70);

        // Réponses
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Détail des Réponses:', 20, 90);

        let y = 105;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        answers.forEach((answer: AnswerDetail, index: number) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.text(`Q${index + 1}: ${answer.questionText.substring(0, 50)}...`, 20, y);
            y += 8;
            doc.text(`Votre réponse: ${answer.userAnswer}`, 30, y);
            y += 8;
            if (!answer.isCorrect) {
                doc.text(`Bonne réponse: ${answer.correctAnswer}`, 30, y);
                y += 8;
            }
            doc.text(answer.isCorrect ? '✓ Correct' : '✗ Incorrect', 30, y);
            y += 12;
        });

        // Sauvegarder
        const filename = `resultat_${student.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        toast.success('Export PDF réussi !');

    } catch {
        toast.error('Erreur lors de l\'export PDF');
    }
}; 