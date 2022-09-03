package com.androidjs.example;

import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;

public class JSInterface {

	public static final int uio_fullscreen =
			View.SYSTEM_UI_FLAG_LAYOUT_STABLE
					| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
					| View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
					| View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
					| View.SYSTEM_UI_FLAG_FULLSCREEN
					| View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
	public static int uio_default = 0;
	protected Context ctx;
	protected MainActivity activity;

	JSInterface(MainActivity activity, WebView webView, WebSettings webSettings) {
		this.activity = activity;
		this.ctx = (Context) activity;
		uio_default = activity.getWindow().getDecorView().getSystemUiVisibility();
	}

	//// JS API
	@JavascriptInterface
	public Activity getActivity() {
		return activity;
	}

	@JavascriptInterface
	public int getVersion() {
		return android.os.Build.VERSION.SDK_INT;
	}

	// MESSAGES
	@JavascriptInterface
	public void showToast(String str, int len) {
		Toast.makeText(ctx, str, len).show();
	}

	@JavascriptInterface
	public void showMessage(String title, String message) {
		activity.showMessage(title, message);
	}

	@JavascriptInterface
	public void showError(String title, String message) {
		activity.showError(title, message);
	}

	@JavascriptInterface
	public String[] getMsgOptions() {
		return new String[]{MainActivity.msgTitle};
	}

	@JavascriptInterface
	public void setMsgOptions(String[] options) {
		MainActivity.msgTitle = options[0];
	}

	@JavascriptInterface
	public int getOrientation() {
		return activity.getRequestedOrientation();
	}

	// UI
	@JavascriptInterface
	public void setOrientation(int state) {
		activity.runOnUiThread(() -> {
			/*
				UNSPECIFIED     = -1
				LANDSCAPE       = 0
				PORTRAIT        = 1

				(Check ActivityInfo.SCREEN_ORIENTATION_...)
			 */
			activity.setRequestedOrientation(state);
		});
	}

	@JavascriptInterface
	public void showFullscreen(boolean state) {
		activity.runOnUiThread(() -> {
			if (state) {
				// TODO: FIX CUTOUT
				activity.getWindow().getDecorView().setSystemUiVisibility(uio_fullscreen);
			} else {
				activity.getWindow().getDecorView().setSystemUiVisibility(uio_default);
			}
		});
	}

	@JavascriptInterface
	public boolean isFullscreen() {
		return (uio_fullscreen == activity.getWindow().getDecorView().getSystemUiVisibility());
	}

	@JavascriptInterface
	public void showActionBar(boolean state) {
		if (isFullscreen()) {
			return;
		}

		activity.runOnUiThread(() -> {
			if (state) {
				if (activity.getSupportActionBar() != null && !activity.getSupportActionBar().isShowing()) {
					activity.getSupportActionBar().show();
				}
			} else {
				if (activity.getSupportActionBar() != null && activity.getSupportActionBar().isShowing()) {
					activity.getSupportActionBar().hide();
				}
			}
		});
	}

	@JavascriptInterface
	public boolean getActionBarVisibility() {
		return (activity.getSupportActionBar() != null && activity.getSupportActionBar().isShowing());
	}


	// CLASSES
	@JavascriptInterface
	public Class importClass(String filename, String forname) {
		// TODO: TEST
		File myJar = new File(filename);
		Class<?> a = null; // TODO: Scope diying

		try {
			URLClassLoader child = new URLClassLoader(
					new URL[]{myJar.toURI().toURL()},
					this.getClass().getClassLoader()
			);

			a = Class.forName(forname);
		} catch (MalformedURLException | ClassNotFoundException e) {
			return null;
		}

		return a;
	}
}
