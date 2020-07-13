package net.es.topologywizard.invoke;

import static java.util.Arrays.asList;

import java.io.IOException;


import net.es.topologywizard.configuration.ConfigLoader;
import net.es.topologywizard.servlet.*;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.bio.SocketConnector;
import org.mortbay.jetty.handler.HandlerList;
import org.mortbay.jetty.handler.ResourceHandler;
import org.mortbay.jetty.security.Constraint;
import org.mortbay.jetty.security.ConstraintMapping;
import org.mortbay.jetty.security.HashUserRealm;
import org.mortbay.jetty.security.SecurityHandler;
import org.mortbay.jetty.servlet.Context;
import org.mortbay.jetty.servlet.ServletHolder;

import joptsimple.OptionParser;
import joptsimple.OptionSet;

public class Invoker {
    private static Server server;
    private static Integer httpPort = 8083;
    private static String host = "0.0.0.0";

    public static void main(String[] args) throws Exception {

        System.out.println("starting up");

        Invoker.parseCLI(args);
        Invoker.initJetty();

        while (true) {
            Thread.sleep(100);
        }
    }

    private static void parseCLI(String[] args) throws IOException {
        // create a parser
        OptionParser parser = new OptionParser() {
            {
                acceptsAll( asList( "h", "?" ), "show help then exit" );
                accepts( "help", "show extended help then exit" );
                accepts( "port" , "HTTP port" ).withRequiredArg().describedAs("port to bind to (8080 default)").ofType(Integer.class);
                accepts( "host" , "host" ).withRequiredArg().describedAs("hostname/address to bind to (0.0.0.0 default)").ofType(String.class);
            }
        };

        OptionSet options = parser.parse( args );

        // check for help
        if ( options.has( "?" ) || options.has("h") || options.has("help")) {
            parser.printHelpOn( System.out );
            System.exit(0);
        }
        if (options.has("port")) {
            httpPort = (Integer) options.valueOf("port");
        }
        if (options.has("host")) {
            host = (String) options.valueOf("host");
        }
    }

    private static void initJetty() throws Exception {
        server = new Server();
        Connector connector=new SocketConnector();
        connector.setPort(httpPort);
        connector.setHost(host);
        server.addConnector(connector);
        
        
        HandlerList handlers = new HandlerList();

        
        Constraint constraint = new Constraint();
        constraint.setName(Constraint.__BASIC_AUTH);;
        constraint.setRoles(new String[]{"user"});
        constraint.setAuthenticate(true);
        
        ConstraintMapping cm = new ConstraintMapping();
        cm.setConstraint(constraint);
        cm.setPathSpec("/*");
        /*
        SecurityHandler sh = new SecurityHandler();
        sh.setUserRealm(new HashUserRealm("MyRealm","config/passwd"));
        sh.setConstraintMappings(new ConstraintMapping[]{cm});
        */
        // create a resource handler
        ResourceHandler rh = new ResourceHandler();
        rh.setWelcomeFiles(new String[]{ "index.html" });
        rh.setResourceBase("./");
        
        // make sure to put the security handler first in the order
        //handlers.addHandler(sh);
        handlers.addHandler(rh);
        

        // add the servlets
        Context root = new Context(server,"/",Context.SESSIONS);
        root.addServlet(new ServletHolder(new TopologyPersistence()), "/topologypersist");
        root.addServlet(new ServletHolder(new RetrieveFormatDescription()), "/retrieveFormatTree");
        root.addServlet(new ServletHolder(new ImportProcessor()), "/importProcessor");
        
        root.addHandler(handlers);
        
        /*
		*/
        server.start();
        server.join();

    }

}
