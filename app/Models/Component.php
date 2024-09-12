<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Component extends Model
{

    use HasFactory;
    protected $fillable = ['url', 'category', 'file_name', 'price', '´type'];

    // public function sofas(): BelongsToMany
    // {
    //     return $this->belongsToMany(\App\Models\Sofa::class, 'component_sofa', 'components_id', 'sofas_id');
    // }

    public function configurations(): BelongsToMany
    {
        return $this->belongsToMany(Configuration::class, 'component_configurations', 'components_id', 'configuration_id')->withTimestamps();
    }
}