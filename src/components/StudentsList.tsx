
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

// Import des types
import type { StudentsListProps } from '../types';

function StudentsList({ students, selectedStudent, onStudentSelect }: StudentsListProps) {
    return (
        <Card className="bg-gray-100 text-gray-900">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Étudiants ({students.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {students.map(student => (
                    <div
                        key={student.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedStudent?.id === student.id
                                ? 'bg-blue-100 border-blue-300'
                                : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => onStudentSelect(student)}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                <p className="text-sm text-blue-600">{student.email}</p>
                                <p className="text-xs text-gray-500">{student.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-900">{student.percentage}%</p>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default StudentsList; 