<?php

use App\Models\Country;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from create store page', function () {
    $response = $this->get(route('create-store.page'));

    $response->assertRedirect(route('login'));
});

test('authenticated users can render create store page with countries', function () {
    $user = User::factory()->create();
    $country = Country::first() ?? Country::create([
        'name_en' => 'Egypt',
        'name_ar' => 'مصر',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->get(route('create-store.page'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('stores/create')
        ->has('countries')
    );
});

test('authenticated users can successfully create a store', function () {
    $user = User::factory()->create();
    $country = Country::first() ?? Country::create([
        'name_en' => 'Egypt',
        'name_ar' => 'مصر',
        'is_active' => true,
    ]);

    $storeData = [
        'name' => 'Tech Nova Store',
        'country_id' => $country->id,
        'phone' => '+201001234567',
        'address' => 'Cairo, Egypt',
        'description' => 'A premier store for tech gadgets',
        'facebook' => 'https://facebook.com/technova',
        'titok' => 'https://tiktok.com/@technova',
        'instagram' => 'https://instagram.com/technova',
    ];

    $response = $this->actingAs($user)->post(route('create-store.store'), $storeData);

    $response->assertRedirect();
    $this->assertDatabaseHas('stores', [
        'user_id' => $user->id,
        'country_id' => $country->id,
        'name' => 'Tech Nova Store',
        'slug' => 'tech-nova-store',
        'phone' => '+201001234567',
        'address' => 'Cairo, Egypt',
        'description' => 'A premier store for tech gadgets',
    ]);
});

test('store creation validates that name is required and unique', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('create-store.store'), [
        'name' => '',
    ]);

    $response->assertSessionHasErrors(['name']);
});
