<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStoreRequest;
use App\Http\Requests\UpdateStoreRequest;
use App\Services\StoreService;
use Inertia\Inertia;

class StoreController extends Controller
{


    public function __construct(protected StoreService $store_service) {}
    public function create_store_page()
    {
        return Inertia::render("stores/create");
    }
    public function store(StoreStoreRequest $request)
    {
        $this->store_service->createStore($request);
        return redirect()->back();
    }
    public function update(UpdateStoreRequest $request, string $slug)
    {
        $this->store_service->updateStore($request, $slug);
        return redirect()->back();
    }
    public function get(string $slug)
    {
        $this->store_service->getStore($slug);
    }
    public function delete(string $slug)
    {
        $this->store_service->deleteStore($slug);
    }
}
