<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function register(Request $request)
{
    // validasi input
    $validated = $request->validate([
        'name'                  => 'required|string|max:255',
        'email'                 => 'required|email|unique:users,email',
        'password'              => 'required|min:6|confirmed',
        // password_confirmation HARUS dikirim dari frontend
        'role'                  => 'nullable|in:admin,petugas',
    ]);

    // buat user baru
    $user = User::create([
        'name'     => $validated['name'],
        'email'    => $validated['email'],
        'password' => bcrypt($validated['password']),
        'role'     => $validated['role'] ?? 'petugas', // default petugas
    ]);

    // kalau mau langsung login setelah register:
    $token = $user->createToken('token')->plainTextToken;

    return response()->json([
        'message' => 'Registrasi berhasil',
        'user'    => $user,
        'token'   => $token,
    ], 201);
}

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Login gagal'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }
}
