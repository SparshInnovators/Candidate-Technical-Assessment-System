<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->string('session_id');
            $table->json('selected_languages');
            $table->json('answers')->nullable();
            $table->integer('score')->default(0);
            $table->integer('total_questions')->default(0);
            $table->boolean('completed')->default(false);
            $table->string('resume_path')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};