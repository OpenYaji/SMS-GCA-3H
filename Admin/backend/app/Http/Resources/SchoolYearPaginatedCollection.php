<?php

namespace App\Http\Resources;

use App\Models\SchoolYear;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SchoolYearPaginatedCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'data' => SchoolYearResource::collection($this->collection),
            'pagination' => $this->getPaginationWithYearNames(),
        ];
    }

    protected function getPaginationWithYearNames()
    {
        $paginator = $this->resource;
        
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'links' => $this->getLinksWithYearNames($paginator),
            'year_names' => $this->getAllYearNames($paginator),
        ];
    }

    protected function getLinksWithYearNames($paginator)
    {
        $links = $paginator->linkCollection()->toArray();
        $allYearNames = $this->getAllYearNames($paginator);
        
        foreach ($links as &$link) {
            if (is_numeric($link['label']) && isset($allYearNames[$link['label']])) {
                $link['year_name'] = $allYearNames[$link['label']];
            }
        }
        
        return $links;
    }

    protected function getAllYearNames($paginator)
    {
        $allSchoolYears = SchoolYear::orderBy('StartDate', 'desc')->get();
        $yearNames = [];
        
        foreach ($allSchoolYears as $index => $schoolYear) {
            $yearNames[$index + 1] = $schoolYear->YearName;
        }
        
        return $yearNames;
    }

    /**
     * Customize the outgoing response to remove default pagination structure
     */
    public function toResponse($request)
    {
        return $this->resource instanceof \Illuminate\Pagination\AbstractPaginator
                    ? (new \Illuminate\Http\JsonResponse($this->toArray($request)))
                    : parent::toResponse($request);
    }
}