import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  constructor() {}
  private beginnerQuestions = [
    // Basic Vocabulary
    {
      type: 'multiple-choice',
      question: 'What does the word "chat" mean?',
      options: ['Dog', 'Cat', 'Bird', 'Fish'],
      correctAnswer: 'Cat',
    },
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you translate "house"?',
    //   options: ['École', 'Maison', 'Chien', 'Voiture'],
    //   correctAnswer: 'Maison',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'What is the plural form of "ami" (friend)?',
    //   options: ['Amis', 'Amies', 'Ami', 'Amis-es'],
    //   correctAnswer: 'Amis',
    // },

    // Basic Verbs & Conjugations
    {
      type: 'fill-in-the-blank',
      question: 'Je ___ un livre.',
      options: ['suis', 'lis', 'mange', 'bois'],
      correctAnswer: 'lis',
    },
    // {
    //   type: 'fill-in-the-blank',
    //   question: 'Nous ___ en France.',
    //   options: ['aller', 'sommes', 'avons', 'suis'],
    //   correctAnswer: 'sommes',
    // },
    // {
    //   type: 'fill-in-the-blank',
    //   question: 'Ils ___ du café tous les matins.',
    //   options: ['bois', 'boivent', 'boit', 'buvons'],
    //   correctAnswer: 'boivent',
    // },

    // // Articles & Agreement
    // {
    //   type: 'multiple-choice',
    //   question: 'Which is the correct article for "pomme" (apple)?',
    //   options: ['Le', 'La', 'Les', 'L’'],
    //   correctAnswer: 'La',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'What is the correct plural form of "un animal"?',
    //   options: ['Une animaux', 'Des animaux', 'Les animale', 'Des animal'],
    //   correctAnswer: 'Des animaux',
    // },

    // // Numbers
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you say "17"?',
    //   options: ['Dix-sept', 'Seize', 'Dix-neuf', 'Vingt'],
    //   correctAnswer: 'Dix-sept',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you write 85?',
    //   options: ['Quatre-vingt-cinq', 'Quatre-vingts-cinq', 'Quatre-vingt-dix', 'Soixante-quinze'],
    //   correctAnswer: 'Quatre-vingt-cinq',
    // },

    // // Common Expressions
    // {
    //   type: 'fill-in-the-blank',
    //   question: 'Comment ___-tu?',
    //   options: ['est', 'es', 'suis', 'as'],
    //   correctAnswer: 'es',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you say "Thank you"?',
    //   options: ['Bonjour', 'Pardon', 'Merci', 'Salut'],
    //   correctAnswer: 'Merci',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'What is the correct response to "Comment ça va?"',
    //   options: ['Je suis maison.', 'Ça va bien.', 'Je mange du pain.', 'Je suis chat.'],
    //   correctAnswer: 'Ça va bien.',
    // },

    // // Days of the Week
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you say "Monday"?',
    //   options: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi'],
    //   correctAnswer: 'Lundi',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'Which day comes between "mercredi" and "vendredi"?',
    //   options: ['Lundi', 'Jeudi', 'Samedi', 'Dimanche'],
    //   correctAnswer: 'Jeudi',
    // },

    // // Time & Weather
    // {
    //   type: 'fill-in-the-blank',
    //   question: 'Aujourd’hui, il fait très ___.',
    //   options: ['froid', 'chaud', 'vent', 'neige'],
    //   correctAnswer: 'froid',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you ask "What time is it?"?',
    //   options: ['Quelle heure est-il?', 'Comment ça va?', 'Où est la gare?', 'Combien ça coûte?'],
    //   correctAnswer: 'Quelle heure est-il?',
    // },

    // Reading Comprehension
    {
      type: 'reading-comprehension',
      passage: 'Marie adore les pommes. Elle mange des pommes tous les jours.',
      question: 'What does Marie eat every day?',
      options: ['Apples', 'Bananas', 'Pears', 'Grapes'],
      correctAnswer: 'Apples',
    },
    // {
    //   type: 'reading-comprehension',
    //   passage: 'Paul has a dog and a cat. He plays with them every day.',
    //   question: 'What animals does Paul have?',
    //   options: ['A dog and a cat', 'A fish and a rabbit', 'Two dogs', 'A cat and a hamster'],
    //   correctAnswer: 'A dog and a cat',
    // },

    // Listening Comprehension
    {
      type: 'listening',
      audioUrl: 'assets/audio/greetings.mp3',
      question: 'What does the greeting in this audio mean?',
      options: ['Bonjour', 'Merci', 'Au revoir', 'Pardon'],
      correctAnswer: 'Bonjour',
    },
    // {
    //   type: 'listening',
    //   audioUrl: 'assets/audio/numbers.mp3',
    //   question: 'Which number is spoken in this audio?',
    //   options: ['Three', 'Five', 'Ten', 'Seven'],
    //   correctAnswer: 'Five',
    // },

    // // Word Matching
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you translate "flower"?',
    //   options: ['Fleur', 'Arbre', 'Feuille', 'Herbe'],
    //   correctAnswer: 'Fleur',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you translate "table"?',
    //   options: ['Chaise', 'Bureau', 'Table', 'Lit'],
    //   correctAnswer: 'Table',
    // },

    // // Grammar Structures
    // {
    //   type: 'fill-in-the-blank',
    //   question: 'Il ___ un frère et une sœur.',
    //   options: ['a', 'ai', 'as', 'avons'],
    //   correctAnswer: 'a',
    // },
    // {
    //   type: 'fill-in-the-blank',
    //   question: 'Je vais ___ marché.',
    //   options: ['au', 'à la', 'aux', 'en'],
    //   correctAnswer: 'au',
    // },

    // // Negation
    // {
    //   type: 'multiple-choice',
    //   question: 'What is the correct negative form of "Je mange une pomme"?',
    //   options: ['Je ne mange pas une pomme', 'Je ne mange pas de pomme', 'Je ne mange pas pomme', 'Je mange pas de pomme'],
    //   correctAnswer: 'Je ne mange pas de pomme',
    // },

    // // Colors
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you translate "green"?',
    //   options: ['Rouge', 'Vert', 'Bleu', 'Jaune'],
    //   correctAnswer: 'Vert',
    // },
    // {
    //   type: 'multiple-choice',
    //   question: 'How do you translate "yellow"?',
    //   options: ['Rouge', 'Vert', 'Bleu', 'Jaune'],
    //   correctAnswer: 'Jaune',
    // }
  ];

  private intermediateQuestions = [
    {
      type: 'multiple-choice',
      question: "Quelle est la traduction de 'I used to go'?",
      options: ['Je suis allé', 'J’allais', 'J’irais', 'Je vais aller'],
      correctAnswer: 'J’allais',
    },
    {
      type: 'reading-comprehension',
      passage: "Les Français adorent le pain. Ils en mangent tous les jours.",
      question: "Que mangent les Français tous les jours?",
      options: ['Du fromage', 'Du pain', 'Du vin', 'Des fruits'],
      correctAnswer: 'Du pain',
    },
  ];

  getQuestions(level: string) {
    if (level === 'beginner') {
      return this.beginnerQuestions;
    } else if (level === 'intermediate') {
      return this.intermediateQuestions;
    }
    return [];
  }
  getTotalQuestions(level: string) {
    return this.getQuestions(level).length;
  }
}
