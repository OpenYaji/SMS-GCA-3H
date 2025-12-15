<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentGradesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Organize grades by school year -> section -> quarter -> subjects
        $organizedGrades = $this->enrollments->map(function ($enrollment) {
            // Group grades by quarter
            $gradesByQuarter = $enrollment->grades->groupBy('Quarter')->map(function ($quarterGrades) {
                return $quarterGrades->map(function ($grade) {
                    return [
                        'Subject' => $grade->subject->SubjectName,
                        'SubjectCode' => $grade->subject->SubjectCode,
                        'GradeValue' => $grade->GradeValue,
                        'Remarks' => $grade->Remarks,
                        'Status' => $grade->gradeStatus?->StatusName,
                        'LastModified' => $grade->LastModified,
                    ];
                })->sortBy('Subject')->values();
            });

            // Calculate quarter averages
            $quarterAverages = $gradesByQuarter->map(function ($quarterGrades) {
                $validGrades = $quarterGrades->where('GradeValue', '!=', null)->pluck('GradeValue');
                return $validGrades->isNotEmpty() ? round($validGrades->avg(), 2) : null;
            });

            // Calculate general average (average of all quarter averages)
            $validAverages = $quarterAverages->filter(fn($avg) => !is_null($avg));
            $generalAverage = $validAverages->isNotEmpty() ? round($validAverages->avg(), 2) : null;

            return [
                'SchoolYear' => $enrollment->section->schoolYear->YearName,
                'GradeLevel' => $enrollment->section->gradeLevel->LevelName,
                'Section' => $enrollment->section->SectionName,
                'Quarters' => [
                    'FirstQuarter' => [
                        'Grades' => $gradesByQuarter->get('First Quarter', []),
                        'Average' => $quarterAverages->get('First Quarter'),
                    ],
                    'SecondQuarter' => [
                        'Grades' => $gradesByQuarter->get('Second Quarter', []),
                        'Average' => $quarterAverages->get('Second Quarter'),
                    ],
                    'ThirdQuarter' => [
                        'Grades' => $gradesByQuarter->get('Third Quarter', []),
                        'Average' => $quarterAverages->get('Third Quarter'),
                    ],
                    'FourthQuarter' => [
                        'Grades' => $gradesByQuarter->get('Fourth Quarter', []),
                        'Average' => $quarterAverages->get('Fourth Quarter'),
                    ],
                ],
                'GeneralAverage' => $generalAverage,
                'Summary' => [
                    'TotalSubjects' => $enrollment->grades->unique('SubjectID')->count(),
                    'CompletedQuarters' => $gradesByQuarter->count(),
                ],
            ];
        })->sortByDesc('SchoolYear')->values();

        return [
            'StudentProfileID' => $this->StudentProfileID,
            'StudentNumber' => $this->StudentNumber,
            'LastName' =>$this->profile->LastName,
            'FirstName' =>$this->profile->FirstName,
            'MiddleName' =>$this->profile->MiddleName,
            'GradeRecords' => $organizedGrades,
        ];
    }
}