<?php
namespace App\Services;

use App\Models\Member;
use App\Models\Label;
use App\Models\Scopes\MemberScope;

class LabelService
{
    public function getUsedLabel($label_id=null)
    {
        $label = null;
        if (!empty($label_id)) {
            $label = Label::find($label_id);
        }
        if (!empty($label)) {
            return $label;
        }
        return null;
    }
}