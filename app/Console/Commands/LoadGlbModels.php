<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Component;

class LoadGlbModels extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:load-glb-models';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Load GLB models from storage and insert into components table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $directory = public_path('assets/models');
        $files = scandir($directory);

        foreach ($files as $file) {
            // Skip directories
            if (is_dir($directory . '/' . $file)) {
                continue;
            }

            // Use regex to capture the category and the rest of the filename
            if (preg_match('/^(1 SEATER|CHAISE RIGHT|CHAISE LEFT|CORNER LEFT|CORNER RIGHT)_(.*)$/', $file, $matches)) {
                $category = $matches[1];

                // Generate the URL for the file
                $url = asset('assets/models/' . $file);




                // $product = Component::firstOrNew([
                //     'url' => $url
                // ]);

                // $product->fill([
                //     'category' => $category,
                //     'product_id' => $id,
                //     'subcategory' => $prefix

                // ]);
                Component::create([
                    'url' => $url,
                    'filename' => $file,
                    'category' => $category,
                ]);


                echo "category: $category, File: $file, $ URL: $url\n";
            }
        }

        $this->info('The files have been processed.');
    }
}
