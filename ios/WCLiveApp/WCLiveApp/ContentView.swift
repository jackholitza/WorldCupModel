import SwiftUI

struct ContentView: View {
    @State private var reloadToken = UUID()
    @State private var isLoading = true

    private let appURL = URL(string: "https://jackholitza.github.io/WorldCupModel/?source=ios")!

    var body: some View {
        ZStack(alignment: .top) {
            WebView(url: appURL, reloadToken: reloadToken, isLoading: $isLoading)
                .ignoresSafeArea(.container, edges: .bottom)

            VStack(spacing: 0) {
                HStack(spacing: 12) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("WCLIVE")
                            .font(.headline.weight(.bold))
                        Text("World Cup model")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }

                    Spacer()

                    Button {
                        reloadToken = UUID()
                    } label: {
                        Image(systemName: "arrow.clockwise")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .accessibilityLabel("Refresh")

                    Link(destination: appURL) {
                        Image(systemName: "safari")
                            .font(.system(size: 16, weight: .semibold))
                    }
                    .accessibilityLabel("Open in Safari")
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(.regularMaterial)

                if isLoading {
                    ProgressView()
                        .progressViewStyle(.linear)
                        .tint(.green)
                }
            }
        }
    }
}
