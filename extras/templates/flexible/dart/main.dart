import 'dart:io';
import 'dart:async';

Future main() async {
  var requestServer = await HttpServer.bind(InternetAddress.ANY_IP_V4, 8080);
  print('listening port ${requestServer.port}');
  try {
    await for (HttpRequest request in requestServer) {
      request.response
        ..write('Hello World!')
        ..close();
    }
  } catch (e) {
    print(e.toString);
  }
}