<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Configuration extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'configuration', 'componentList', 'identifier'];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class,
            'by_user_id' //custom name
        );
    }
    public function components(): BelongsToMany
    {
        return $this->belongsToMany(Configuration::class, 'component_configurations', 'configuration_id', 'components_id')->withTimestamps();
    }

    public function componentsFromConfiguration(): HasMany
    {
        return $this->hasMany(Component::class);
    }
}
