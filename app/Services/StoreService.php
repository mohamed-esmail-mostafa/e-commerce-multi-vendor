<?php

namespace App\Services;

use App\Http\Requests\StoreStoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Models\Store;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class StoreService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected CloudinaryService $cloudinary_service) {}

    public function createStore(StoreStoreRequest $request)
    {
        $store = new Store;
        $store->country_id = $request->country_id;
        $store->user_id = Auth::user()->id;
        $store->name = $request->name;
        $store->slug = Str::slug($request->name);
        $store->phone = $request->phone;
        $store->address = $request->address;
        $store->description = $request->description;
        $store->facebook = $request->facebook;
        $store->titok = $request->titok;
        $store->instagram = $request->instagram;

        if ($request->hasFile('logo')) {
            $logo_result = $this->cloudinary_service->uploadToCloudinary($request->file('logo'), 'stores/logos');
            $store->logo = $logo_result['url'];
            $store->public_logo_id = $logo_result['public_id'];
        }
        if ($request->hasFile('cover')) {
            $cover_result = $this->cloudinary_service->uploadToCloudinary($request->file('cover'), 'stores/covers');
            $store->cover = $cover_result['url'];
            $store->public_cover_id = $cover_result['public_id'];
        }
        $store->save();

        return $store;
    }

    public function updateStore(UpdateStoreRequest $request, string $slug)
    {
        $store = $this->getStore($slug);
        $store->country_id = $request->country_id;
        $store->user_id = Auth::user()->id;
        $store->name = $request->name;
        $store->slug = Str::slug($request->name);
        $store->phone = $request->phone;
        $store->address = $request->address;
        $store->description = $request->description;
        $store->facebook = $request->facebook;
        $store->titok = $request->titok;
        $store->instagram = $request->instagram;

        if ($request->hasFile('logo')) {
            $this->cloudinary_service->deleteFromCloudinary($store->public_logo_id ?? null);
            $logo_result = $this->cloudinary_service->uploadToCloudinary($request->file('logo'), 'stores/logos');
            $store->logo = $logo_result['url'];
            $store->public_logo_id = $logo_result['public_id'];
        }
        if ($request->hasFile('cover')) {
            $this->cloudinary_service->deleteFromCloudinary($store->public_cover_id ?? null);
            $cover_result = $this->cloudinary_service->uploadToCloudinary($request->file('cover'), 'stores/covers');
            $store->cover = $cover_result['url'];
            $store->public_cover_id = $cover_result['public_id'];
        }
        $store->save();

        return $store;
    }

    public function getStore(string $slug)
    {
        return Store::where('slug', $slug)->firstOrFail();
    }

    public function deleteStore($slug)
    {
        $store = $this->getStore($slug);
        $this->cloudinary_service->deleteFromCloudinary($store->public_cover_id ?? null);
        $this->cloudinary_service->deleteFromCloudinary($store->public_logo_id ?? null);
        $store->delete();

        return true;
    }
}
