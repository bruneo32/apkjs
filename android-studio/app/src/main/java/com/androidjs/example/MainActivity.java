package com.androidjs.example;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.ConsoleMessage;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

	public static final String index_path = "file:///android_asset/index.html";

	public static WebView webView = null;
	public static WebSettings webSettings = null;

	public static boolean canGoBack = true;
	public static boolean updateTitle = true;
	public static String msgTitle = null;

	@SuppressWarnings("deprecation")
	@SuppressLint({"SetJavaScriptEnabled"})
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		getSupportActionBar().hide();

		try {
			// Get webview & errorLabel
			webView = findViewById(R.id.webview0);

			webView.setWebViewClient(new WebViewClient() {
				@Override
				public boolean shouldOverrideUrlLoading(WebView view, String url) {
					return false;
				}
			});

			webView.setWebChromeClient(new WebChromeClient() {
				@Override
				public void onProgressChanged(WebView view, int progress) {
					if (!updateTitle) {
						return;
					}

					// Change the Title in ActionBar on changed
					getSupportActionBar().setTitle(view.getTitle());
					super.onProgressChanged(view, progress);
				}

				@Override
				public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
					Toast.makeText(getApplicationContext(), "["+consoleMessage.messageLevel() +"] "+ consoleMessage.message(), Toast.LENGTH_SHORT).show();
					return super.onConsoleMessage(consoleMessage);
				}

				@Override
				public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
					new AlertDialog.Builder(view.getContext())
							.setTitle(msgTitle == null ? view.getTitle() : msgTitle).setMessage(message).setPositiveButton("OK",
							(dialogInterface, i) -> {
								result.confirm();
								dialogInterface.cancel();
							}).setOnCancelListener(dialogInterface -> result.cancel()).show();

					return true;
				}

				@Override
				public boolean onJsConfirm(WebView view, String url, String message, JsResult result) {

					new AlertDialog.Builder(view.getContext()).setCancelable(false)
							.setTitle(msgTitle == null ? view.getTitle() : msgTitle).setMessage(message)
							.setPositiveButton("OK", (dialogInterface, i) -> {
								result.confirm();
								dialogInterface.cancel();
							})
							.setNegativeButton("CANCEL", (dialogInterface, i) -> {
								result.cancel();
								dialogInterface.cancel();
							}).show();

					return true;
				}

				@Override
				public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
					final EditText input = new EditText(view.getContext());
					input.setText(defaultValue);

					new AlertDialog.Builder(view.getContext()).setCancelable(false)
							.setTitle(msgTitle == null ? view.getTitle() : msgTitle).setMessage(message)
							.setPositiveButton("OK", (dialogInterface, i) -> {
								result.confirm(input.getText().toString());
								dialogInterface.cancel();
							})
							.setNegativeButton("CANCEL", (dialogInterface, i) -> {
								result.cancel();
								dialogInterface.cancel();
							})
							.setView(input).show();

					return true;
				}
			});
			webSettings = webView.getSettings();

			// Allows
			webSettings.setJavaScriptEnabled(true);
			webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
			webSettings.setSupportMultipleWindows(true);
			webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
			webSettings.setDisplayZoomControls(false);
			webSettings.setAllowFileAccess(true);
			webSettings.setAllowFileAccessFromFileURLs(true);
			webSettings.setMediaPlaybackRequiresUserGesture(false);
			webSettings.setAllowContentAccess(true);
			webSettings.setDomStorageEnabled(true);
			webSettings.setSupportMultipleWindows(true);
			webSettings.setPluginState(WebSettings.PluginState.ON);
			webSettings.setPluginState(WebSettings.PluginState.ON_DEMAND);
			webSettings.setJavaScriptEnabled(true);
			webSettings.setLoadWithOverviewMode(true);
			webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

			// Setup JavaScriptInterface
			webView.addJavascriptInterface(new JSInterface(this, webView, webSettings), "Android");

			// GO
			webView.loadUrl(index_path);

		} catch (Exception e) {
			showError("Exception", e.getMessage());
		}
	}

	@Override
	public void onBackPressed() {
		if (canGoBack) {
			if (!webView.canGoBack()) {
				super.onBackPressed();
				return;
			}

			webView.goBack();
		}
	}


	// API
	public void showMessage(String title, String message) {
		new AlertDialog.Builder(this)
				.setTitle(title).setMessage(message).setPositiveButton("OK",
				(dialogInterface, i) -> dialogInterface.cancel()
		).show();
	}

	public void showError(String title, String message) {
		new AlertDialog.Builder(this)
				.setTitle(title).setMessage(message).setPositiveButton("ABORT",
				(dialogInterface, i) -> finishAndRemoveTask()).setCancelable(false).show();
	}

}
