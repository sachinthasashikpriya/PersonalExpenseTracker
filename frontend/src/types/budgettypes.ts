export interface Contributor {
  name: string;
  email?: string;
  contribution: number;
}

export interface BudgetItem {
  id?: string;
  name: string;
  estimatedAmount: number;
  actualAmount?: number;
  category: string;
  contributors: Contributor[];
}

export interface Budget {
  _id?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  status: "planning" | "ongoing" | "completed";
  items: BudgetItem[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface BudgetFormProps {
  existingBudget: Budget | null;
  onSave: () => void;
  onCancel: () => void;
}

export interface BudgetListProps {
  budgets: Budget[];
  loading: boolean;
  onSelectBudget: (budget: Budget) => void;
  onRefresh: () => void;
}

export interface BudgetDetailsProps {
  budget: Budget;
  onEdit: () => void;
  onBack: () => void;
  onUpdate: () => void;
}

export type BudgetStatus = "planning" | "ongoing" | "completed";
export type BudgetCategory = 
  | "essentials"
  | "housing"
  | "transportation"
  | "food"
  | "utilities"
  | "insurance"
  | "healthcare"
  | "entertainment"
  | "education"
  | "personal"
  | "debt"
  | "savings"
  | "other";