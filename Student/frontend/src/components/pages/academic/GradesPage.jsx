    import React from 'react';
import GradesSummary from './GradesSummary';

const ParentComponent = () => {
    const gradeData = {
        summary: {
            total: 100,
            average: 85,
        },
        subjects: ['Math', 'Science', 'History'],
    };

    return (
        <div>
            <h1>Grade Summary</h1>
            <GradesSummary data={gradeData.summary} subjects={gradeData.subjects} />
        </div>
    );
};

export default ParentComponent;
