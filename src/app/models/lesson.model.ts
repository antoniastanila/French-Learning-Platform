export interface Lesson {
    _id: string;
    title: string;
    description: string;
    content: { phrase: string; translation: string }[]; // Array de fraze
    difficulty: 'A1' | 'A2' | 'B1' | 'B2'; // Nivelul de dificultate
    level: 'beginner' | 'intermediate' | 'advanced'; // Nivelul lecției
    isUnlocked: boolean; // Dacă lecția este accesibilă sau nu
    isCompleted?: boolean; 
    order: number; 
  }
  